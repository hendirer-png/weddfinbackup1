import supabase from '@/lib/supabaseClient';
import { TeamProjectPayment, PaymentStatus } from '@/types';

const TABLE = 'team_project_payments';

function toRow(p: TeamProjectPayment) {
  const isUuid = (v?: string) => !!v && /^[0-9a-fA-F-]{36}$/.test(v);
  const row: any = {
    project_id: p.projectId,
    team_member_name: p.teamMemberName,
    team_member_id: p.teamMemberId,
    date: p.date,
    status: p.status,
    fee: p.fee,
    amount_paid: p.amountPaid || 0,
  };
  // Only pass id if it's a valid UUID; otherwise let DB generate it
  if (isUuid(p.id as any)) row.id = p.id;
  return row;
}

function fromRow(row: any): TeamProjectPayment {
  return {
    id: row.id,
    projectId: row.project_id,
    teamMemberName: row.team_member_name,
    teamMemberId: row.team_member_id,
    date: row.date,
    status: row.status as PaymentStatus,
    fee: Number(row.fee || 0),
    amountPaid: Number(row.amount_paid || 0),
  };
}

export async function listAllTeamPayments(): Promise<TeamProjectPayment[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('date', { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function listTeamPaymentsByProject(projectId: string): Promise<TeamProjectPayment[]> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('project_id', projectId);
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function upsertTeamPaymentsForProject(projectId: string, items: TeamProjectPayment[]): Promise<TeamProjectPayment[]> {
  const incoming = Array.isArray(items) ? items : [];

  const { data: existingData, error: existingErr } = await supabase
    .from(TABLE)
    .select('*')
    .eq('project_id', projectId);
  if (existingErr) throw existingErr;

  const existing = (existingData || []).map(fromRow);
  const existingByMemberId = new Map(existing.map((p) => [p.teamMemberId, p] as const));

  const incomingMemberIds = new Set(incoming.map((p) => p.teamMemberId));

  const merged: TeamProjectPayment[] = incoming.map((p) => {
    const prev = existingByMemberId.get(p.teamMemberId);
    if (!prev) return p;

    const isPaid = prev.status === PaymentStatus.LUNAS;
    return {
      ...p,
      id: prev.id,
      status: isPaid ? PaymentStatus.LUNAS : p.status,
      fee: isPaid ? prev.fee : p.fee,
      date: isPaid ? prev.date : p.date,
      teamMemberName: isPaid ? prev.teamMemberName : p.teamMemberName,
      amountPaid: isPaid ? prev.amountPaid : p.amountPaid,
    };
  });

  // Always keep paid history, even if the member is removed from the project later.
  for (const prev of existing) {
    if (prev.status === PaymentStatus.LUNAS && !incomingMemberIds.has(prev.teamMemberId)) {
      merged.push(prev);
    }
  }

  // Delete only unpaid rows that are no longer present.
  const toDeleteIds = existing
    .filter((p) => p.status !== PaymentStatus.LUNAS && !incomingMemberIds.has(p.teamMemberId))
    .map((p) => p.id);

  if (toDeleteIds.length > 0) {
    const { error: delErr } = await supabase
      .from(TABLE)
      .delete()
      .eq('project_id', projectId)
      .in('id', toDeleteIds);
    if (delErr) throw delErr;
  }

  if (merged.length === 0) return [];
  const rows = merged.map(toRow);
  const { data, error: upsertErr } = await supabase
    .from(TABLE)
    .upsert(rows, { onConflict: 'id' })
    .select();
  if (upsertErr) throw upsertErr;
  return (data || []).map(fromRow);
}

export async function markTeamPaymentStatus(id: string, status: PaymentStatus): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ status }).eq('id', id);
  if (error) throw error;
}

export async function updateTeamPaymentFee(id: string, fee: number, status: PaymentStatus): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ fee, status }).eq('id', id);
  if (error) throw error;
}

export async function updateTeamProjectPayment(id: string, patch: Partial<TeamProjectPayment>): Promise<TeamProjectPayment> {
  const row: any = {};
  if (patch.projectId !== undefined) row.project_id = patch.projectId;
  if (patch.teamMemberName !== undefined) row.team_member_name = patch.teamMemberName;
  if (patch.teamMemberId !== undefined) row.team_member_id = patch.teamMemberId;
  if (patch.date !== undefined) row.date = patch.date;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.fee !== undefined) row.fee = patch.fee;
  if (patch.amountPaid !== undefined) row.amount_paid = patch.amountPaid;

  const { data, error } = await supabase.from(TABLE).update(row).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateTeamProjectPayments(items: TeamProjectPayment[]): Promise<TeamProjectPayment[]> {
  const rows = items.map(toRow);
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function deleteTeamPaymentsByProject(projectId: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('project_id', projectId);
  if (error) throw error;
}

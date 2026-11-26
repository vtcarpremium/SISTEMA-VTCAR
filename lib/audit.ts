
import { isIP } from "node:net";
import { query } from "./db";

interface AuditLogInput {
  userId: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  if (
    !input.action ||
    input.action.length > 100 ||
    !input.entity ||
    input.entity.length > 100
  ) {
    throw new Error("Dados de auditoria inválidos.");
  }

  const rawIp = input.ipAddress?.split(",")[0]?.trim() ?? null;
  const validIp = rawIp && isIP(rawIp) ? rawIp : null;

  const details = input.details ?? {};

  await query(
    `INSERT INTO audit_logs (
      user_id,
      action,
      entity,
      entity_id,
      details,
      ip_address,
      user_agent
    )
    VALUES ($1, $2, $3, $4, $5::jsonb, $6::inet, $7)`,
    [
      input.userId,
      input.action,
      input.entity,
      input.entityId ?? null,
      JSON.stringify(details),
      validIp,
      input.userAgent?.slice(0, 1000) ?? null,
    ]
  );
}

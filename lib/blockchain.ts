import crypto from 'crypto';

export type Block = { index:number, timestamp:string, budget_id:number, old_data:any, new_data:any, user_id:string, reason:string, prev_hash:string, hash:string };

export function createHash(data: any): string {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex').substring(0,16);
}

export function createBlock(prevBlock: Block | null, budget_id:number, old_data:any, new_data:any, user_id:string, reason:string): Block {
  const index = prevBlock ? prevBlock.index + 1 : 0;
  const timestamp = new Date().toISOString();
  const prev_hash = prevBlock ? prevBlock.hash : '0'.repeat(16);
  const content = { index, timestamp, budget_id, old_data, new_data, user_id, reason, prev_hash };
  const hash = createHash(content);
  return { ...content, hash };
}

export function verifyChain(chain: Block[]): boolean {
  for (let i=1; i<chain.length; i++) {
    if (chain[i].prev_hash !== chain[i-1].hash) return false;
    const recalculated = createHash({ index: chain[i].index, timestamp: chain[i].timestamp, budget_id: chain[i].budget_id, old_data: chain[i].old_data, new_data: chain[i].new_data, user_id: chain[i].user_id, reason: chain[i].reason, prev_hash: chain[i].prev_hash });
    if (recalculated !== chain[i].hash) return false;
  }
  return true;
}
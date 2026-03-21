import { supabase } from '@/lib/supabase';

export interface ValidationResponse {
  canAccess: boolean;
  isPremium: boolean;
  currentUsage: number;
  limit: number;
}

export interface IncrementResponse {
  success: boolean;
  newUsage: number;
  limit: number;
}

const RPC_TIMEOUT = 5000;

async function rpcCall<T>(
  fnName: string,
  params: Record<string, unknown>
): Promise<T> {
  try {
    const client = supabase as unknown as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: T; error: Error | null }>
    };
    
    const { data, error } = await Promise.race([
      client.rpc(fnName, params),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('RPC timeout')), RPC_TIMEOUT)
      ),
    ]);

    if (error) {
      throw error;
    }

    return (data ?? null) as T;
  } catch (error) {
    console.error(`RPC call ${fnName} failed:`, error);
    throw error;
  }
}

export async function validateUserUsage(
  userId: string,
  feature: string
): Promise<ValidationResponse> {
  try {
    const result = await rpcCall<ValidationResponse>('validate_user_usage', {
      user_id_param: userId,
      feature_param: feature,
    });

    return result;
  } catch (error) {
    console.error('Usage validation RPC failed:', error);
    return {
      canAccess: false,
      isPremium: false,
      currentUsage: 0,
      limit: 0,
    };
  }
}

export async function incrementUsage(
  userId: string,
  feature: string
): Promise<IncrementResponse> {
  try {
    const result = await rpcCall<IncrementResponse>('increment_user_usage', {
      user_id_param: userId,
      feature_param: feature,
    });

    return result;
  } catch (error) {
    console.error('Increment usage RPC failed:', error);
    return {
      success: false,
      newUsage: 0,
      limit: 0,
    };
  }
}

export async function validateAndIncrement(
  userId: string,
  feature: string
): Promise<ValidationResponse> {
  const validation = await validateUserUsage(userId, feature);

  if (!validation.canAccess) {
    return validation;
  }

  await incrementUsage(userId, feature);

  return validation;
}

'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateRoadmapNodes(roadmapId: string, nodes: Record<string, unknown>[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('roadmaps')
      .update({ nodes })
      .eq('id', roadmapId)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error('Failed to update roadmap nodes:', err);
    return { success: false, error: 'Failed to update progress' };
  }
}

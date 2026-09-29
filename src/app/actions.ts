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

export async function updateRoadmapGraph(roadmapId: string, nodes: Record<string, unknown>[], edges: Record<string, unknown>[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('roadmaps')
      .update({ nodes, edges })
      .eq('id', roadmapId)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error('Failed to update roadmap graph:', err);
    return { success: false, error: 'Failed to update graph' };
  }
}

export async function grantNodeCompletionXP() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp, current_streak, last_activity_date, nodes_completed')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      // If profile doesn't exist yet, we can't grant XP
      console.error('Failed to fetch profile for XP grant:', profileError);
      return { success: false };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = profile.current_streak;
    const lastActivity = profile.last_activity_date ? new Date(profile.last_activity_date) : null;
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 1) {
        // Activity was yesterday
        newStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1;
      }
      // If diffDays === 0, activity was today, streak remains the same
    } else {
      // First activity ever
      newStreak = 1;
    }

    const xpToGrant = 50;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        xp: profile.xp + xpToGrant,
        current_streak: newStreak,
        last_activity_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        nodes_completed: profile.nodes_completed + 1
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return { success: true, grantedXP: xpToGrant };
  } catch (err) {
    console.error('Failed to grant XP:', err);
    return { success: false, error: 'Failed to grant XP' };
  }
}

export async function getProfile() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, current_streak, last_activity_date, nodes_completed')
      .eq('id', user.id)
      .single();

    return profile || { xp: 0, current_streak: 0, nodes_completed: 0 };
  } catch (err) {
    console.error('Failed to get profile:', err);
    return null;
  }
}

export async function getCareerReadiness() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data: roadmaps } = await supabase
      .from('roadmaps')
      .select('nodes')
      .eq('user_id', user.id);

    if (!roadmaps || roadmaps.length === 0) return 0;

    let completedStandard = 0;
    let completedBoss = 0;
    let totalStandard = 0;
    let totalBoss = 0;

    roadmaps.forEach(roadmap => {
      const nodes = roadmap.nodes as Record<string, unknown>[];
      if (Array.isArray(nodes)) {
        nodes.forEach(node => {
          if (node.is_boss_node) {
            totalBoss++;
            if (node.completed) completedBoss++;
          } else {
            totalStandard++;
            if (node.completed) completedStandard++;
          }
        });
      }
    });

    const totalWeighted = (totalStandard * 1) + (totalBoss * 5);
    if (totalWeighted === 0) return 0;

    const completedWeighted = (completedStandard * 1) + (completedBoss * 5);
    const score = Math.round((completedWeighted / totalWeighted) * 100);
    
    return score;
  } catch (err) {
    console.error('Failed to calculate readiness:', err);
    return 0;
  }
}

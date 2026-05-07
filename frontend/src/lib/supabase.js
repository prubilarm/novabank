import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rcvrtebpbakqryhgcdjc.supabase.co';
const supabaseKey = 'sb_publishable_nAPZV4l1IPRH-UuWAVCAoA_CDY6_5qY';

export const supabase = createClient(supabaseUrl, supabaseKey);

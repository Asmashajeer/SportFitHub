import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionsTable from '../component/session-management/SessionsTable';

import SessionStats from '../component/session-management/SessionStats';
import { PAYLOAD_MODEL } from '@/constants/constants';

const AdminSessions = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-1">
            Sessions
          </h1>
          <p className="text-sm text-zinc-500">
            Manage and approve trainer sessions
          </p>
        </div>

        {/* Stats */}
        <SessionStats />

        {/* Tabs */}
        <Tabs defaultValue="sports" className="w-full">
          <TabsList className="w-full max-w-xs rounded-lg xborder border-zinc-700/40 h-10 mb-6">
            <TabsTrigger
              value="sports"
              className="flex-1 text-sm data-[state=active]:bg-zinc-900 data-[state=active]:text-green-700"
            >
              Sports
           
            </TabsTrigger>
            <TabsTrigger
              value="fitness"
              className="flex-1 text-sm text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-green-700"
            >
              Fitness
             
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sports">
            <SessionsTable sessionModel={PAYLOAD_MODEL.SPORT_SESSION} />
          </TabsContent>

          <TabsContent value="fitness">
            <SessionsTable sessionModel={PAYLOAD_MODEL.FITNESS_SESSION} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSessions;

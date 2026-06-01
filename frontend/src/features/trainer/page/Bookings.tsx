import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Upcoming from '../component/bookings/Upcoming';
import History from '../component/bookings/History';

const Bookings = () => {
  return (
    <div className="bg-card min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Bookings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage users booked into your sessions
        </p>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-zinc-700/40 overflow-hidden">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full rounded-none bg-zinc-800/40 h-12">
            <TabsTrigger
              value="upcoming"
              className="bg-zinc-850 data-[state=active]:bg-zinc-900 "
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className=" bg-zinc-850  data-[state=active]:bg-zinc-900  "
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="p-4">
            <Upcoming />
          </TabsContent>

          <TabsContent value="history" className="p-4">
            <History />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default Bookings;

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SportsSessions from '../component/sessions/sportsSessions/SportsSessions.trainer';
import FitnessSessions from '../component/sessions/fitnessSessions/FitnessSessions.trainer';

const Sessions = () => {
  return (
    <div className=" bg-card ">
      <div className="mb-5">
        <h1 className="text-2xl font-bold"> Sessions </h1>
        <p>
          Manage and organize the global sports list and fitness levels used
          across the platform
        </p>
      </div>
      <div className=" h-screen overflow-hidden shadow-sm rounded-xl px-2">
        <Tabs defaultValue="sports" className=" flex-1 w-full ">
          <TabsList className="  w-full ">
            <TabsTrigger
              value="sports"
              className="px-8 py-5 m-0 text-lg bg-transparent text-gray-600 font-bold "
            >
              Sports
            </TabsTrigger>
            <TabsTrigger
              value="fitness"
              className="px-8 py-5 m-0 text-lg bg-transparent font-bold"
            >
              Fitness
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sports" className="w-full bg-black ">
            <SportsSessions />
          </TabsContent>
          <TabsContent value="fitness" className="w-full  bg-black  ">
            <FitnessSessions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sessions;

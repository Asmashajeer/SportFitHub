import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SportsManager from './SportsManager';
import FitnessManager from './FitnessManager';

const Categories = () => {
  return (
    <div className=" bg-card ">
      <div className="mb-5">
        <h1 className="text-2xl font-bold"> Categories </h1>
        <p>
          Manage and organize the global sports list and fitness levels used
          across the platform
        </p>
      </div>
      <div className=" h-screen overflow-hidden shadow-sm rounded-xl">
        <Tabs defaultValue="sports" className=" flex-1 w-full ">
          <TabsList>
            <TabsTrigger
              value="sports"
              className="px-8 py-3 m-0 text-lg bg-transparent font-semibold"
            >
              Sports
            </TabsTrigger>
            <TabsTrigger
              value="fitness"
              className="px-8 py-3 m-0 text-lg bg-transparent font-semibold"
            >
              Fitness
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sports" className="w-full">
            <SportsManager />
          </TabsContent>
          <TabsContent value="fitness" className="w-full ">
            <FitnessManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Categories;

import  { type LucideIcon } from "lucide-react";
interface StatCardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  cls: string;
}
function StatCard({
  label,
  value,
  icon:Icon,
  cls,
}: StatCardProps ) {
  return (
    <div
      key={label}
      className="bg-zinc-800/40 border px-0 m-0 border-zinc-700/40 rounded-lg md:p-4"
    >     
         <p className="text-xs text-zinc-500 mb-1">{label}</p>
       <div className="flex items-center gap-1 md:gap-2 justify-center rounded-lg">
          {Icon && <Icon className="w-5 h-5 text-gray-500" />}
          <p className={`text-sm md:text-2xl  md:font-semibold ${cls}`}>{value}</p> 
        </div>
            
      
    </div>
  );
}
export default StatCard;

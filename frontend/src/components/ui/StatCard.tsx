import {type LucideIcon } from "lucide-react";


interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string; 
  borderColor: string; 
}
const  StatCard=({title, value,icon:Icon,color,borderColor}:StatCardProps)=> {
  return (
    <div className={`bg-secondary p-3 rounded-xl shadow-sm border-r-2 border-b-2 ${borderColor} flex items-center justify-between`}>
        <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-primary">{value}</h3>
      </div>
      <div className='p-3 rounded-lg bg-secondary'>
       <Icon className={color} />
      </div>
    </div>
  )
}



export default StatCard


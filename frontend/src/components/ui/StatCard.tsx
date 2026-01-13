import {type LucideIcon } from "lucide-react";


interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string; 
  bgColor: string; 
}
const  StatCard=({title, value,icon:Icon,color,bgColor}:StatCardProps)=> {
  return (
    <div className="bg-secondary p-5 rounded-xl shadow-sm border-r-2 border-b-2 flex items-center justify-between">
        <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-primary">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>
       <Icon className={color} />
      </div>
    </div>
  )
}



export default StatCard


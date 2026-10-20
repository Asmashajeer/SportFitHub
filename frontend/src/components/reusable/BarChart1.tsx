import { ResponsiveContainer,  XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const BarChart1 = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
     <div className="w-full h-55">
              <ResponsiveContainer width="100%" height="100%">
                {data.length === 0 ? (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    Loading chart data...
                  </div>
                ) : (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#18181b' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl border border-slate-700 bg-zinc-900 p-3 text-xs shadow-md">
                              <p className="font-semibold text-slate-200">{label}</p>
                              <p className="font-medium text-green-500">Value: {payload[0].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }} 
                    />
                    <Bar dataKey="value" fill="#16a34a" stroke= '#3f3f46' radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
  );
};
export default BarChart1;
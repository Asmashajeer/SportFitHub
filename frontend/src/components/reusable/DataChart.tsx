import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';


const DataChart = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
    

      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          {data.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">Loading chart data...</div>
          ) : (
            <RechartsAreaChart data={data}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
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
              <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} fill="url(#rev)" />
            </RechartsAreaChart>
          )}
        </ResponsiveContainer>
      </div>
    
  );
};
export default DataChart;

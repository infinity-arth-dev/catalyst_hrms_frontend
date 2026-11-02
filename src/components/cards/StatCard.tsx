import { StatCardProps } from "@/constants/Types";

export default function StatCard({ title, value, icon }: StatCardProps) {
  const isOrange = title.toLowerCase().includes("absent") || title.toLowerCase().includes("leave");

  return (
    <div className="bg-white dark:bg-primary p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm w-full h-full flex flex-col justify-between md:min-h-50 transition-all duration-300 group hover:border-gray-200 dark:hover:border-gray-700">
      <div className="flex justify-between items-start">
        <h3 className="text-4xl font-extrabold text-primary dark:text-white tracking-tight">
          {value}
        </h3>

        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
          isOrange 
            ? "bg-brand-orange/10 text-brand-orange" 
            : "bg-brand-blue/10 text-brand-blue"
        }`}>
          {icon || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
            </svg>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end mt-4">
        <p className="text-secondary dark:text-gray-400 text-sm font-semibold">
          {title}
        </p>

        <div className="flex items-end gap-1.5 h-8">
          {isOrange ? (
            <>
              <div className="w-2.5 rounded-t-sm bg-brand-orange/30 h-[40%]"></div>
              <div className="w-2.5 rounded-t-sm bg-brand-orange/50 h-[70%]"></div>
              <div className="w-2.5 rounded-t-sm bg-brand-orange h-full shadow-xs shadow-brand-orange/30"></div>
              <div className="w-2.5 rounded-t-sm bg-brand-orange/60 h-[50%]"></div>
              <div className="w-2.5 rounded-t-sm bg-brand-orange/40 h-[60%]"></div>
            </>
          ) : (
            <>
              <div className="w-2.5 rounded-t-sm bg-brand-blue/30 h-[40%]"></div>
              <div className="w-2.5 rounded-t-sm bg-brand-blue/50 h-[70%]"></div>
              <div className="w-2.5 rounded-t-sm bg-brand-blue h-full shadow-xs shadow-brand-blue/30"></div>
              <div className="w-2.5 rounded-t-sm bg-brand-blue/60 h-[50%]"></div>
              <div className="w-2.5 rounded-t-sm bg-brand-blue/40 h-[60%]"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

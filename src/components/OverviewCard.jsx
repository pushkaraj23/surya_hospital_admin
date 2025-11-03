import React from "react";

const OverviewCard = ({ title, value, icon: Icon, color = "bg-primary" }) => {
  return (
    <div
      className={`relative p-5 rounded-xl shadow-md border-l-4 text-white flex items-center justify-between transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg ${color}`}
    >
      <div>
        <h4 className="text-sm font-secondary uppercase opacity-90 tracking-wide">
          {title}
        </h4>
        <p className="text-3xl font-semibold mt-1 font-primary">{value}</p>
      </div>

      {Icon && (
        <div className="opacity-80">
          <Icon className="text-4xl" />
        </div>
      )}
    </div>
  );
};

export default OverviewCard;

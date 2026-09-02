import React from "react";
import {
  Smile,
  Stethoscope,
  ShieldCheck,
  Sparkles,
  Baby,
  Activity,
  FileCheck,
  LucideProps,
} from "lucide-react";

interface DepartmentIconProps extends LucideProps {
  name: string;
}

export function DepartmentIcon({ name, className = "w-5 h-5", ...props }: DepartmentIconProps) {
  switch (name) {
    case "Smile":
      return <Smile className={className} {...props} />;
    case "Stethoscope":
      return <Stethoscope className={className} {...props} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} {...props} />;
    case "Sparkles":
      return <Sparkles className={className} {...props} />;
    case "Baby":
      return <Baby className={className} {...props} />;
    case "Activity":
      return <Activity className={className} {...props} />;
    case "FileCheck":
      return <FileCheck className={className} {...props} />;
    default:
      return <Sparkles className={className} {...props} />;
  }
}

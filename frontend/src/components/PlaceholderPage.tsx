import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const PlaceholderPage = ({ title, description, icon: Icon }: PlaceholderPageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#1a1a2e]">{title}</h2>
        <p className="text-sm text-[#6c757d] mt-1">{description}</p>
      </div>
      <div className="bg-white border border-[#dee2e6] rounded-sm p-12 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#f8f9fa] rounded-sm">
            <Icon className="w-8 h-8 text-[#6c757d]" />
          </div>
          <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">Coming Soon</h3>
          <p className="text-sm text-[#6c757d]">{title} will be available in a future update</p>
        </div>
      </div>
    </div>
  );
};

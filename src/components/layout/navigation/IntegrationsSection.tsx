
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Plug } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface IntegrationsSectionProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export const IntegrationsSection: React.FC<IntegrationsSectionProps> = ({
  isSidebarOpen,
  isMobile,
}) => {
  const { pathname } = useLocation();

  // Integrations submenu
  const integrations = [
    {
      title: "Tilda",
      href: "/dashboard/integrations/tilda",
      icon: <Plug className="mr-2 h-4 w-4" />,
    }
  ];

  if (isMobile || isSidebarOpen) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="integrations" className="border-none">
          <AccordionTrigger className="py-2 px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:no-underline rounded-lg transition-colors">
            <div className="flex items-center">
              <Plug className="mr-2 h-4 w-4" />
              Интеграции
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-0">
            <div className="flex flex-col space-y-1 pl-6">
              {integrations.map((integration, index) => (
                <Link
                  key={index}
                  to={integration.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === integration.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {integration.icon}
                  {integration.title}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  // Simplified icon-only version for collapsed sidebar
  return (
    <Link
      to="/dashboard/integrations/tilda"
      className={cn(
        "flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        pathname.includes("/integrations")
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground"
      )}
    >
      <Plug className="h-4 w-4" />
    </Link>
  );
};

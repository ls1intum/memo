import { Info, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SCROLLBAR_STYLES } from '@/components/session/session-constants';

interface ThemeColors {
  primary: string;
  secondary: string;
}

interface CompetencyCardProps {
  type: 'competency';
  title: string;
  description?: string | null;
  themeColors: ThemeColors;
  borderColorClass: string;
  gradientFromClass: string;
  isTransitioning: boolean;
  bloomLevel?: string;
  category?: string;
}

interface ResourceCardProps {
  type: 'resource';
  title: string;
  url: string;
  themeColors: ThemeColors;
  borderColorClass: string;
  gradientFromClass: string;
  isTransitioning: boolean;
}

type MappingCardProps = CompetencyCardProps | ResourceCardProps;

export function MappingCard(props: MappingCardProps) {
  const {
    type,
    title,
    themeColors,
    borderColorClass,
    gradientFromClass,
    isTransitioning,
  } = props;

  const transitionClasses = isTransitioning
    ? 'opacity-60 scale-[0.99]'
    : 'opacity-100 scale-100';

  if (type === 'resource') {
    const { url } = props as ResourceCardProps;
    return (
      <Card
        className={`relative flex h-[280px] flex-col border-2 ${borderColorClass} bg-gradient-to-br ${gradientFromClass} to-white shadow-lg transition-all duration-300 overflow-hidden ${transitionClasses}`}
      >
        <div
          className="absolute left-0 top-0 h-full w-1.5 rounded-r-full"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${themeColors.primary}, ${themeColors.secondary})`,
          }}
        />
        <CardHeader className="flex h-full flex-col space-y-3 pb-3 pl-5 overflow-visible">
          <div className="flex-shrink-0">
            <Badge
              className="w-fit text-white font-semibold text-xs px-3 py-1.5"
              style={{
                backgroundColor: themeColors.primary,
                borderColor: themeColors.primary,
              }}
            >
              Resource
            </Badge>
          </div>
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            <CardTitle className="text-xl font-bold text-slate-900 flex-shrink-0">
              {title}
            </CardTitle>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 hover:underline transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              {url}
            </a>
          </div>
        </CardHeader>
      </Card>
    );
  }

  // Competency card
  const {
    description = '',
    bloomLevel = 'Apply',
    category = 'Control Flow',
  } = props as CompetencyCardProps;

  return (
    <Card
      className={`relative flex h-[280px] flex-col border-2 ${borderColorClass} bg-gradient-to-br ${gradientFromClass} to-white shadow-lg transition-all duration-300 overflow-hidden ${transitionClasses}`}
    >
      <div
        className="absolute left-0 top-0 h-full w-1.5 rounded-r-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${themeColors.primary}, ${themeColors.secondary})`,
        }}
      />
      <CardHeader className="flex h-full flex-col space-y-3 pb-3 pl-5 overflow-visible">
        <div className="flex-shrink-0">
          <Badge
            className="w-fit text-white font-semibold text-xs px-3 py-1.5"
            style={{
              backgroundColor: themeColors.primary,
              borderColor: themeColors.primary,
            }}
          >
            Competency
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 flex-shrink-0">
          <Tooltip side="top">
            <TooltipTrigger asChild>
              <Badge
                tabIndex={0}
                className="bg-slate-100 text-slate-700 border border-slate-300 cursor-help hover:bg-slate-200 transition-colors"
              >
                {bloomLevel}
                <Info className="h-3 w-3 ml-1.5" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Bloom&apos;s Taxonomy categorizes learning objectives by
                cognitive level.
              </p>
              <p className="mt-1">
                → {bloomLevel}: use knowledge in practice (implement, execute,
                solve).
              </p>
              <p className="mt-1 text-[11px] text-slate-200">
                Levels: Remember • Understand • Apply • Analyze • Evaluate •
                Create
              </p>
            </TooltipContent>
          </Tooltip>
          <Badge className="bg-slate-100 text-slate-700 border border-slate-300">
            {category}
          </Badge>
        </div>
        <div className="flex-1 flex flex-col min-h-0 space-y-2">
          <CardTitle className="text-xl font-bold text-slate-900 flex-shrink-0">
            {title}
          </CardTitle>
          <div
            className="flex-1 overflow-y-scroll pr-2 scrollbar-thin"
            style={SCROLLBAR_STYLES}
          >
            <CardDescription className="text-base leading-relaxed text-slate-600">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

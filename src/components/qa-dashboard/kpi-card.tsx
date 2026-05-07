import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function KPICard({ title, value, subtitle, trend, children, variant = 'default' }: KPICardProps) {
  const getTrendColor = (trendValue: number) => {
    if (trendValue > 0) return 'text-success';
    if (trendValue < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-l-4 border-l-success';
      case 'warning':
        return 'border-l-4 border-l-warning';
      case 'danger':
        return 'border-l-4 border-l-destructive';
      default:
        return '';
    }
  };

  return (
    <Card className={`${getVariantStyles()}`}>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            {trend !== undefined && (
              <div className={`flex items-center text-sm font-medium ${getTrendColor(trend)}`}>
                {trend > 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

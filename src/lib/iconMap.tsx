import { 
  Settings, 
  Edit, 
  Shield, 
  Car, 
  MessageCircle, 
  Phone, 
  ArrowUp,
  Star,
  Clock,
  Users,
  MapPin,
  Mail,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Check,
  AlertCircle,
  Tag,
  List,
  Grid3X3,
  Info,
  Play,
  Pause,
  type LucideIcon
} from 'lucide-react';

// 아이콘 매핑 테이블
const iconMap: Record<string, LucideIcon> = {
  'settings': Settings,
  'edit': Edit,
  'shield': Shield,
  'car': Car,
  'message-circle': MessageCircle,
  'phone': Phone,
  'arrow-up': ArrowUp,
  'star': Star,
  'clock': Clock,
  'users': Users,
  'map-pin': MapPin,
  'mail': Mail,
  'search': Search,
  'menu': Menu,
  'x': X,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'check': Check,
  'alert-circle': AlertCircle,
  'tag': Tag,
  'list': List,
  'grid': Grid3X3,
  'info': Info,
  'play': Play,
  'pause': Pause,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<IconProps> = ({ 
  name, 
  className = '', 
  size = 24 
}) => {
  const IconComponent = iconMap[name.toLowerCase()];
  
  if (!IconComponent) {
    // 기본 아이콘이나 경고 표시
    console.warn(`Icon "${name}" not found in iconMap. Available icons:`, Object.keys(iconMap));
    return <AlertCircle className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
};

// 아이콘이 존재하는지 확인하는 유틸리티
export const hasIcon = (name: string): boolean => {
  return iconMap.hasOwnProperty(name.toLowerCase());
};

// 사용 가능한 모든 아이콘 이름 가져오기
export const getAvailableIconNames = (): string[] => {
  return Object.keys(iconMap);
}; 
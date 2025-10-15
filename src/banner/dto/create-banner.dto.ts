export class CreateBannerDto {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonColor?: string;
  titleColor?: string;
  backgroundColor?: string;
  isActive?: boolean;
  sortOrder?: number;
}

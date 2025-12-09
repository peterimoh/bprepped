import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  width?: number;
  height?: number;
  path?: string;
  disabled?: boolean;
}

export function Logo({
  width = 180,
  height = 180,
  path = '/',
  disabled = false,
}: LogoProps) {
  return (
    <Link href={disabled && !path ? '#' : path} passHref>
      <Image
        src={
          'https://res.cloudinary.com/dywofwzdx/image/upload/v1765091339/ChatGPT_Image_Dec_6__2025__08_36_18_AM-removebg-preview_pkcwlg.png'
        }
        alt={'logo'}
        width={width}
        height={height}
      />
    </Link>
  );
}

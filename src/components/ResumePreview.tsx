import { cn } from "@/lib/utils";
import { ResumeValues } from "../lib/validation";
import { useEffect, useRef, useState } from "react";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

export default function ResumePreview({
  resumeData,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        <PersonalInfoHeader resumeData={resumeData} />
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
}
// COMMENT this section carries the header of the preview page: picture, name, job title and city, country email
function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const { photo, firstName, lastName, jobTitle, city, country, email, phone } =
    resumeData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";

    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo == null) setPhotoSrc("");

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Author"
          className="aspect-square object-cover"
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1.5">
          <p className="text-3xl font-bold">
            {firstName} {lastName}
          </p>
          <p className="text-lg">{jobTitle}</p>
          <p className="text-sm text-muted-foreground">
            {city}, {country} — {email} | {phone}
          </p>

          <p className="font-medium">{jobTitle}</p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (email || phone) ? " . " : ""}

          {[phone, email].filter(Boolean).join(" . ")}
        </p>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { ResumeValues } from "../lib/validation";
import { useEffect, useRef, useState } from "react";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";
import { formatDate } from "date-fns";
import { Badge } from "./ui/badge";

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
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
}
// COMMENT this section carries the header COMMENT of the preview page: picture, name, job title and city, country email COMMENT.
function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    email,
    phone,
    colorHex,
    borderStyle,
  } = resumeData;

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

//COMMENT this contains the  COMMENT summary of the preview page COMMENT.

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary } = resumeData;

  if (!summary) return null;

  return (
    <>
      <hr className="border-2" />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold">Professional profile</p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
}

//COMMENT this contains the  COMMENT work experience of the preview page COMMENT.

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences } = resumeData;

  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    <>
      <hr className="border-2" />
      <div className="space-y-3">
        <p className="text-lg font-semibold">Work experience</p>
        {workExperiencesNotEmpty.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{exp.position}</span>
              {exp.startDate && (
                <span>
                  {`${formatDate(exp.startDate, "MM/YYYY")} - ${exp.endDate ? formatDate(exp.endDate, "MM/YYYY") : "Present"}`}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.company}</p>
            <p className="whitespace-pre-line text-xs">{exp.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

//COMMENT this contains the  COMMENT Education section of the preview page COMMENT.
function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations } = resumeData;

  const educationsNotEmpty = (educations ?? []).filter(
    (edu): edu is NonNullable<typeof edu> =>
      !!edu && Object.values(edu).some(Boolean),
  );

  if (!educationsNotEmpty.length) return null;

  return (
    <>
      <hr className="border-2" />
      <div className="space-y-3">
        <p className="text-lg font-semibold">Education</p>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span className="text-xs text-muted-foreground">
                  {`${formatDate(edu.startDate, "MM/yyyy")} ${
                    edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""
                  }`}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
}

//COMMENT this contains the  COMMENT Skills section of the preview page COMMENT.
function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills } = resumeData;

  if (!skills?.length) return null;

  return (
    <>
      <hr className="border-2" />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold">Skills</p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills.map((skills, index) => (
            <Badge
              key={index}
              className="rounded-md bg-black text-white hover:bg-black"
            >
              {skills}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}

import { EditorFormProps } from "@/lib/types";
import { educationSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function EducationForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations || [],
    },
  });
}

useEffect(() => {
  const { unsubscribe } = form.watch(async (values) => {
    const isValid = await form.trigger();
    if (!isValid) return;
    setResumeData({
      ...resumeData,
      educations: values.educations?.filter((edu) => edu !== undefined) || [],
    });
  });
  return unsubscribe;
}, [form, resumeData, setResumeData]);

//   COMMENT Using the field array
const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "educations",
});

// COMMENT Props
interface workExperienceItemProps {
  form: UseFormReturn<WorkExperienceValues>;
  index: number;
  remove: (index: number) => void;
}

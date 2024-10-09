import { useState, useEffect } from 'react';
import { useAuth } from '@/components/apollo/auth-context-provider';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// You might want to define these types in a separate file
type User = {
  firstName?: string;
  lastName?: string;
  role?: string;
  phoneNumber?: string;
  baseProfile?: {
    displayName?: string;
    bio?: string;
  };
  creatorInfo?: {
    detailedBio?: {
      profession?: string;
      education?: {
        schools?: string[];
        relevantCourses?: string[];
        specializedTraining?: string[];
      };
      professionalAchievements?: {
        awards?: string[];
        exhibitions?: string[];
        portfolioLinks?: string[];
      };
      collaborators?: string[];
      employmentContracts?: string[];
    };
  };
  investorInfo?: {
    investmentPreferences?: string[];
    portfolioSize?: number;
    riskTolerance?: string;
    preferredInvestmentDuration?: string;
  };
};

const FormSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    role: z.string(),
    phoneNumber: z.string().optional(),
    displayName: z.string(),
    bio: z.string().optional(),
    photoUrl: z.string().optional(),
    profession: z.string().optional(),
    schools: z.array(z.object({
      name: z.string(),
      degree: z.string().optional(),
      fieldOfStudy: z.string().optional(),
      graduationYear: z.string().optional(),
    })).optional(),
    relevantCourses: z.array(z.string()).optional(),
    specializedTraining: z.array(z.string()).optional(),
    awards: z.array(z.string()).optional(),
    exhibitions: z.array(z.string()).optional(),
    portfolioLinks: z.array(z.string()).optional(),
    collaborators: z.array(z.string()).optional(),
    employmentContracts: z.array(z.object({
      employer: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      ipRightsInfo: z.string().optional(),
    })).optional(),
    investmentPreferences: z.array(z.string()).optional(),
    portfolioSize: z.number().optional(),
    riskTolerance: z.string().optional(),
    preferredInvestmentDuration: z.string().optional(),
  });
  
type FormData = z.infer<typeof FormSchema>;

const steps = [
    { title: 'Basic Information', fields: ['firstName', 'lastName'] },
    { title: 'Profile Information', fields: ['displayName', 'displayRole', 'photoUrl', 'bio'] },
    { title: 'Professional Information', fields: ['profession', 'schools', 'relevantCourses', 'specializedTraining'] },
    { title: 'Achievements', fields: ['awards', 'exhibitions', 'portfolioLinks'] },
    { title: 'Collaborations', fields: ['collaborators', 'employmentContracts'] },
    { title: 'Investment Information', fields: ['investmentPreferences', 'portfolioSize', 'riskTolerance', 'preferredInvestmentDuration'] },
    { title: 'KYC', fields: ['phoneNumber'] },
  ];

const calculateCompletionPercentage = (data: FormData) => {
    const totalFields = Object.keys(FormSchema.shape).length;
    const filledFields = Object.entries(data).filter(([key, value]) => {
        if (Array.isArray(value)) {
            return value.length > 0 && value.some(item => Object.values(item).some(v => v !== ""));
        }
        return value !== "" && value !== null && value !== undefined;
    }).length;
    return (filledFields / totalFields) * 100;
};

export const useProfileCompletion = () => {
  const { user } = useAuth();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const form = useForm<FormData>();

  useEffect(() => {
    if (user) {
      const formData: FormData = {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        role: user.role ?? "Investor",
        phoneNumber: user.phoneNumber ?? "",
        displayName: user.baseProfile?.displayName ?? "",
        bio: user.baseProfile?.bio ?? "",
        profession: user.creatorInfo?.detailedBio?.profession ?? "",
        schools: user.creatorInfo?.detailedBio?.education?.schools ?? [],
        relevantCourses: user.creatorInfo?.detailedBio?.education?.relevantCourses ?? [],
        specializedTraining: user.creatorInfo?.detailedBio?.education?.specializedTraining ?? [],
        awards: user.creatorInfo?.detailedBio?.professionalAchievements?.awards ?? [],
        exhibitions: user.creatorInfo?.detailedBio?.professionalAchievements?.exhibitions ?? [],
        portfolioLinks: user.creatorInfo?.detailedBio?.professionalAchievements?.portfolioLinks ?? [],
        collaborators: user.creatorInfo?.detailedBio?.collaborators ?? [],
        employmentContracts: user.creatorInfo?.detailedBio?.employmentContracts ?? [],
        investmentPreferences: user.investorInfo?.investmentPreferences ?? [],
        portfolioSize: user.investorInfo?.portfolioSize ?? 0,
        riskTolerance: user.investorInfo?.riskTolerance ?? "",
        preferredInvestmentDuration: user.investorInfo?.preferredInvestmentDuration ?? "",
      };

      form.reset(formData);
      const percentage = calculateCompletionPercentage(formData);
      setCompletionPercentage(percentage);
    }
  }, [user, form]);

  const updateCompletionPercentage = (formData: any) => {
    const percentage = calculateCompletionPercentage(formData);
    setCompletionPercentage(percentage);
  };

  return {
    form,
    completionPercentage,
    updateCompletionPercentage,
  };
};
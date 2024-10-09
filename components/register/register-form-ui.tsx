import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@apollo/client';
import { useAuth } from '@/components/apollo/auth-context-provider';
import { LoadingFeature } from '@/components/loading/loading-feature';
import { 
    REGISTER_USER, UPDATE_USER
} from '@/graphql/mutations';
import { IS_USER_REGISTERED } from '@/graphql/queries';

import * as z from 'zod';
import { Button } from "@/components/ui/shadcn/button-ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/shadcn/form-ui";
import { Input } from "@/components/ui/shadcn/input-ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select-ui";
import { Textarea } from "@/components/ui/shadcn/textarea-ui";
import { Checkbox } from "@/components/ui/shadcn/checkbox-ui";
import { Progress } from "@/components/ui/shadcn/progress-ui";
import { useProfileCompletion } from '@/hooks/use-profile-completion';

type RegisterFormProps = {
    _id?: string;
    user?: any;
    variant?: 'default' | 'ghost' | 'outline';
    children?: React.ReactNode;
    onRegister?: () => void;
    updatePercentage?: (formData: any) => void;
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

const RegisterForm: React.FC<RegisterFormProps> = ({ _id, onRegister, variant, children, updatePercentage }) => {
    const [baseUser, setBaseUser] = useState<any>();
    const [currentStep, setCurrentStep] = useState(0);
    // const [completionPercentage, setCompletionPercentage] = useState(0);
    const [registerUser] = useMutation(REGISTER_USER);
    const [updateUser] = useMutation(UPDATE_USER);
    const { user } = useAuth();
    const { completionPercentage, updateCompletionPercentage } = useProfileCompletion();
    const { data: isRegisteredData, loading: isRegisteredLoading } = useQuery(IS_USER_REGISTERED, {
        variables: { email: user?.email },
        skip: !user?.email,
    });

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: useMemo(() => ({
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            role: user?.role ?? "Investor",
            phoneNumber: user?.phoneNumber ?? "",
            displayName: user?.baseProfile?.displayName ?? "",
            bio: user?.baseProfile?.bio ?? "",
            profession: user?.creatorInfo?.detailedBio?.profession ?? "",
            schools: user?.creatorInfo?.detailedBio?.education?.schools ?? [],
            relevantCourses: user?.creatorInfo?.detailedBio?.education?.relevantCourses ?? [],
            specializedTraining: user?.creatorInfo?.detailedBio?.education?.specializedTraining ?? [],
            awards: user?.creatorInfo?.detailedBio?.professionalAchievements?.awards ?? [],
            exhibitions: user?.creatorInfo?.detailedBio?.professionalAchievements?.exhibitions ?? [],
            portfolioLinks: user?.creatorInfo?.detailedBio?.professionalAchievements?.portfolioLinks ?? [],
            collaborators: user?.creatorInfo?.detailedBio?.collaborators ?? [],
            employmentContracts: user?.creatorInfo?.detailedBio?.employmentContracts ?? [],
            investmentPreferences: user?.investorInfo?.investmentPreferences ?? [],
            portfolioSize: user?.investorInfo?.portfolioSize ?? 0,
            riskTolerance: user?.investorInfo?.riskTolerance ?? "",
            preferredInvestmentDuration: user?.investorInfo?.preferredInvestmentDuration ?? "",
        }), [user])
    });

    useEffect(() => {
        if (user) {
          const formData = {
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
          setBaseUser(formData);
          form.reset(formData);
            // form.reset(form.getValues());
            // const percentage = calculateCompletionPercentage(form.getValues());
            // setCompletionPercentage(percentage);
            const firstEmptyField = findFirstEmptyField(form.getValues());
            if (firstEmptyField) {
                setCurrentStep(firstEmptyField.stepIndex);
                setTimeout(() => {
                    const element = document.querySelector(`[name="${firstEmptyField.field}"]`) as HTMLElement;
                    if (element) element.focus();
                }, 0);
            }
        }
    }, [user, form]);

    const findFirstEmptyField = (data: FormData) => {
        for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
            const step = steps[stepIndex];
            for (let fieldIndex = 0; fieldIndex < step.fields.length; fieldIndex++) {
                const field = step.fields[fieldIndex];
                const value = data[field as keyof FormData];
                if (value === "" || value === null || value === undefined || 
                    (Array.isArray(value) && (value.length === 0 || value.every(item => Object.values(item).every(v => v === ""))))) {
                    return { stepIndex, field };
                }
            }
        }
        return null;
    };

    const isEqual = (a: any, b: any): boolean => {
        if (Array.isArray(a) && Array.isArray(b)) {
            return a.length === b.length && a.every((item, index) => isEqual(item, b[index]));
        }
        if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            return keysA.length === keysB.length && keysA.every(key => isEqual(a[key], b[key]));
        }
        return a === b;
    };

    const handleUpdateUser = async (data: Partial<FormData>) => {
      if (!user!._id) {
          console.error('User ID not found');
          return;
      }
  
      // Restructure the data to match the UpdateUserInput type
      const updateData: any = {};
  
      // Handle nested fields
      if (data.displayName || data.bio || data.photoUrl) {
          updateData.baseProfile = {
              ...(data.displayName && { displayName: data.displayName }),
              ...(data.bio && { bio: data.bio }),
              ...(data.photoUrl && { photoUrl: data.photoUrl })
          };
      }
  
      if (data.profession || data.schools || data.relevantCourses || data.specializedTraining ||
          data.awards || data.exhibitions || data.portfolioLinks || data.collaborators || data.employmentContracts) {
          updateData.creatorInfo = {
              detailedBio: {
                  ...(data.profession && { profession: data.profession }),
                  ...(data.schools && { education: { schools: data.schools } }),
                  ...(data.relevantCourses && { education: { ...updateData.creatorInfo?.detailedBio?.education, relevantCourses: data.relevantCourses } }),
                  ...(data.specializedTraining && { education: { ...updateData.creatorInfo?.detailedBio?.education, specializedTraining: data.specializedTraining } }),
                  ...(data.awards && { professionalAchievements: { awards: data.awards } }),
                  ...(data.exhibitions && { professionalAchievements: { ...updateData.creatorInfo?.detailedBio?.professionalAchievements, exhibitions: data.exhibitions } }),
                  ...(data.portfolioLinks && { professionalAchievements: { ...updateData.creatorInfo?.detailedBio?.professionalAchievements, portfolioLinks: data.portfolioLinks } }),
                  ...(data.collaborators && { collaborators: data.collaborators }),
                  ...(data.employmentContracts && { employmentContracts: data.employmentContracts })
              }
          };
      }
  
      if (data.investmentPreferences || data.portfolioSize || data.riskTolerance || data.preferredInvestmentDuration) {
          updateData.investorInfo = {
              ...(data.investmentPreferences && { investmentPreferences: data.investmentPreferences }),
              ...(data.portfolioSize && { portfolioSize: data.portfolioSize }),
              ...(data.riskTolerance && { riskTolerance: data.riskTolerance }),
              ...(data.preferredInvestmentDuration && { preferredInvestmentDuration: data.preferredInvestmentDuration })
          };
      }
  
      console.log('Sending update with data:', JSON.stringify(updateData, null, 2));
  
      try {
          const result = await updateUser({
              variables: {
                  id: user!._id,
                  input: updateData
              }
          });
  
          if (result.data && result.data.updateUser) {
            console.log('User updated successfully:', result.data.updateUser);
            
            // Update the completion percentage after successful update
            const currentFormData = form.getValues();
            updateCompletionPercentage(currentFormData);
            if (updatePercentage) {
                updatePercentage(
                    currentFormData
                );
            }
          } else {
            console.error('UpdateUser mutation returned null or undefined');
          }
      } catch (error: any) {
          console.error('Error updating user:', error);
          if (error.graphQLErrors) {
              error.graphQLErrors.forEach((graphQLError: any) => {
                  console.error('GraphQL error:', graphQLError.message);
                  if (graphQLError.extensions) {
                      console.error('Error extensions:', graphQLError.extensions);
                  }
              });
          }
          if (error.networkError) {
              console.error('Network error:', error.networkError);
          }
      }
  };

    const onSubmit = async (data: FormData) => {
        const currentValues = form.getValues();
        const changedFields: Partial<FormData> = {};

        steps[currentStep].fields.forEach((field) => {
            const currentValue = currentValues[field as keyof FormData];
            const originalValue = baseUser![field as keyof FormData];
            if (!isEqual(currentValue, originalValue)) {
                console.log('Change detected:', field, currentValue, originalValue);
                (changedFields as any)[field as keyof FormData] = currentValue;
            }
        });

        if (Object.keys(changedFields).length > 0) {
            await handleUpdateUser(changedFields);
        } else {
            console.log('No changes detected');
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log('Registration complete');
        }
    };

    const renderField = (field: string) => {
        switch (field) {
            case 'role':
            case 'riskTolerance':
            case 'preferredInvestmentDuration':
                return (
                    <Select onValueChange={(value) => form.setValue(field as any, value)} defaultValue={form.getValues(field as any)}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={`Select ${field}`} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Investor">Investor</SelectItem>
                            <SelectItem value="Creator">Creator</SelectItem>
                            {/* Add more options as needed */}
                        </SelectContent>
                    </Select>
                );
            case 'bio':
                return <Textarea placeholder="Enter your bio" {...form.register(field)} />;
            case 'schools':
            case 'employmentContracts':
                return (
                    <div>
                        {form.getValues(field as any).map((_: any, index: number) => (
                            <div key={index} className="mb-4">
                                <Input placeholder="School Name" {...form.register(`${field}.${index}.name` as any)} className="mb-2" />
                                <Input placeholder="Degree" {...form.register(`${field}.${index}.degree` as any)} className="mb-2" />
                                <Input placeholder="Field of Study" {...form.register(`${field}.${index}.fieldOfStudy` as any)} className="mb-2" />
                                <Input placeholder="Graduation Year" {...form.register(`${field}.${index}.graduationYear` as any)} />
                            </div>
                        ))}
                        <Button type="button" onClick={() => form.setValue(field as any, [...form.getValues(field as any), {}])}>
                            Add {field === 'schools' ? 'School' : 'Employment Contract'}
                        </Button>
                        {form.getValues(field as any).length > 0 && (
                            <Button type="button" onClick={() => form.setValue(field as any, form.getValues(field as any).slice(0, -1))}>
                                Remove {field}
                            </Button>
                        )}
                    </div>
                );
            case 'relevantCourses':
            case 'specializedTraining':
            case 'awards':
            case 'exhibitions':
            case 'portfolioLinks':
            case 'collaborators':
            case 'investmentPreferences':
                return (
                    <div>
                        {form.getValues(field as any).map((_: any , index: number) => (
                            <Input key={index} placeholder={`Enter ${field}`} {...form.register(`${field}.${index}` as any)} className="mb-2" />
                        ))}
                        <Button type="button" onClick={() => form.setValue(field as any, [...form.getValues(field as any), ''])}>
                            Add {field}
                        </Button>
                        {/* add remove button if there is one  */}
                        {form.getValues(field as any).length > 0 && (
                            <Button type="button" onClick={() => form.setValue(field as any, form.getValues(field as any).slice(0, -1))}>
                                Remove {field}
                            </Button>
                        )}
                    </div>
                );
            case 'portfolioSize':
                return <Input type="number" placeholder="Portfolio Size" {...form.register(field, { valueAsNumber: true })} />;
            default:
                return <Input placeholder={field} {...form.register(field as keyof FormData)} />;
        }
    };
  return (
    <Suspense fallback={<LoadingFeature />}>
      {user && (
        <div className="flex flex-col md:flex-row h-3/4">
            <div className="w-11/12 md:w-1/2 p-6">
                <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {steps[currentStep].fields.map((field) => (
                    <FormField
                        key={field}
                        control={form.control}
                        name={field as any}
                        render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</FormLabel>
                            <FormControl>
                            {renderField(field)}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    ))}
                    {currentStep !== 0 && (
                    <Button 
                        variant={variant}
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                    >
                        Previous
                    </Button>
                    )}
                    <Button type="submit" variant={variant}>
                    {currentStep === steps.length - 1 ? 'Register' : 'Next'}
                    </Button>
                    {children}
                </form>
                </Form>
            </div>
            <div className="w-full md:w-1/2 bg-gray-100 p-6 relative overflow-hidden">
                <Progress value={completionPercentage} className="w-full mb-4" />
                <div className="text-center mb-4">
                    {completionPercentage.toFixed(0)}% Complete
                </div>
                <div className="aspect-square bg-no-repeat bg-[url(/sample/register-img.svg)]">
                {/* Placeholder for your static image */}
                </div>
            </div>
        </div>
        )}
    </Suspense>
  );
};

export default RegisterForm;
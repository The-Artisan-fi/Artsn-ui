'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/shadcn/button-ui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog-ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card-ui";
import RegisterFormUI from './register-form-ui';

type RegisterFormProps = {
  _id: string;
  user: any;
  variant?: 'default' | 'ghost' | 'outline';
  children?: React.ReactNode;
  isOpen?: boolean;
  onRegister: () => void;
  updatePercentage: (formData: any) => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ _id, user, onRegister, updatePercentage }) => {
  return (
    <Card className="flex flex-col max-w-3/4">
      <CardHeader>
        <CardTitle>Looks like you need a User Profile!</CardTitle>
      </CardHeader>
        <CardContent>
          Enter a few details about yourself.
        <RegisterFormUI variant="default" updatePercentage={updatePercentage}>
          <p className="mt-4 text-sm text-gray-500">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </RegisterFormUI>
        </CardContent>
    </Card>
  );
};

export default RegisterForm;
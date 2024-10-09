'use client'
import { useState, useEffect, use } from 'react';
import { Button } from "@/components/ui/shadcn/button-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card-ui";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area-ui";
import { useWeb3Auth } from "@/hooks/use-web3-auth";

const AuthLogin: React.FC = () => {
    const { checkIfLoggedIn, loggedIn, login, logout, getUserInfo } = useWeb3Auth();
    const [consoleOutput, setConsoleOutput] = useState<string>("");

    const handleAction = async (action: () => Promise<any>) => {
        try {
          const result = await action();
          setConsoleOutput(JSON.stringify(result, null, 2));
        } catch (error) {
          setConsoleOutput(JSON.stringify(error, null, 2));
        }
    };

    useEffect(() => {
        if(!loggedIn) {
            checkIfLoggedIn();
        }
    }, [loggedIn, checkIfLoggedIn]);
  const loggedInView = (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Web3Auth Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button onClick={
                () => handleAction(getUserInfo)
          } variant="outline">Get User Info</Button>
          {/* <Button onClick={
                () => handleAction(getAccounts)
          } variant="outline">Get Account</Button> */}

          <Button onClick={
                () => handleAction(logout)
          } variant="destructive">Log Out</Button>
        </div>
        <ScrollArea className="h-[200px] mt-4 p-4 rounded-md border">
          <pre className="text-sm">{consoleOutput || "Logged in Successfully!"}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const unloggedInView = (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Web3Auth Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={
            login
        } className="w-full">
          Login
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8">
      {loggedIn ? loggedInView : unloggedInView}
    </div>
  );
};

export default AuthLogin;
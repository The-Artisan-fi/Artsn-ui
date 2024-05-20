import { Onfido } from "onfido-sdk-ui";
import { useEffect } from "react";

export const OnfidoWrapper = () => {
    useEffect(() => {
      Onfido.init({
        token: "<YOUR_SDK_TOKEN>",
        containerId: "onfido-mount",
        steps: ["welcome", "document", "face", "complete"],
      });
    }, []);
  
    return <div id="onfido-mount">
      <h1>Onfido SDK</h1>
    </div>;
};
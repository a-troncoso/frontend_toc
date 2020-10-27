import { useEffect, useState } from "react";

const useImportScript = (resourceUrl) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = resourceUrl;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      setIsLoaded(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return isLoaded;
};

export default useImportScript;

import React, { useEffect, useState } from "react";
import useImportScript from "./utils/importScript";
import "./App.css";

const App = () => {
  const isLivenessScriptLoaded = useImportScript(
    "https://sandbox-web-plugins.s3.amazonaws.com/liveness/js/liveness.js"
  );
  const isAutocaptureScriptLoaded = useImportScript(
    "https://sandbox-web-plugins.s3.amazonaws.com/autocapture/autocapture.js"
  );

  const [sessionID, setSessionID] = useState("0a55ab6996174114b365de13036044df");

  const [isFrontVisible, setIsFrontVisible] = useState(true);
  const [isBackVisible, setIsBackVisible] = useState(false);
  const [isLivenessVisible, setIsLivenessVisible] = useState(false);

  const [frontToken, setFrontToken] = useState(null);
  const [backToken, setBackToken] = useState(null);
  const [livenessToken, setLivenessToken] = useState(null);

  const [documentInformation, setDocumentInformation] = useState(null);

  useEffect(() => {
    // callGetSessionID();
    // callCompareFaceAndDocument();
  }, []);

  useEffect(() => {
    if (isAutocaptureScriptLoaded && sessionID && isFrontVisible)
      callFrontAutocapture();
  }, [isAutocaptureScriptLoaded, sessionID, isFrontVisible]);

  useEffect(() => {
    if (isBackVisible && sessionID) callBackAutocapture();
  }, [isBackVisible, sessionID]);

  useEffect(() => {
    if (isLivenessScriptLoaded && sessionID && isLivenessVisible) callLivenss();
  }, [isLivenessVisible, sessionID, isLivenessScriptLoaded]);

  useEffect(() => {
    if (frontToken && backToken && livenessToken) callCompareFaceAndDocument();
  }, [frontToken, backToken, livenessToken]);

  const callGetSessionID = async () => {
    const URL = "http://localhost:3001/api/session";

    const resp = await fetch(URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    });

    const sessionData = await resp.json();

    setSessionID(sessionData.session.session_id);
  };

  const callFrontAutocapture = () => {
    window.TOCautocapture("containerFront", {
      locale: "es",
      session_id: sessionID,
      document_type: "CHL2", // "CHL1 " | "CHL2"
      document_side: "front", // "front" | "back"
      // http: true, // Only for development
      callback: function (token, image, data) {
        setFrontToken(token);
        alert(token);
        setIsFrontVisible(false);
        setIsBackVisible(true);
      },
      failure: function (error, data) {
        alert(error);
      },
    });
  };

  const callBackAutocapture = () => {
    window.TOCautocapture("containerBack", {
      locale: "es",
      session_id: sessionID,
      document_type: "CHL2", // "CHL1 " | "CHL2"
      document_side: "back", // "front" | "back"
      // http: true, // Only for development
      callback: function (token, image, data) {
        setBackToken(token);
        setIsLivenessVisible(true);
        alert(token);
      },
      failure: function (error, data) {
        alert(error);
      },
    });
  };

  const callLivenss = () => {
    window.TOCliveness("containerLiveness", {
      locale: "es",
      session_id: sessionID,
      // http: true, // Only for development
      callback: (token, image, data) => {
        setLivenessToken(token);
        alert(token);
      },
      failure: (error, data) => {
        alert(error);
      },
    });
  };

  const callCompareFaceAndDocument = async () => {
    const URL = "http://localhost:3001/api/face-and-document";

    const resp = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_front: frontToken,
        id_back: backToken,
        selfie: livenessToken,
        documentType: "CHL2",
      }),
      redirect: "follow",
    });

    const documentInfo = await resp.json();

    console.log(documentInfo);

    setDocumentInformation(JSON.stringify(resp, null, 2));
  };

  return (
    <main className="App">
      <h1>POC TOC</h1>
      <hr />
      <div id="containerBack">
        {isFrontVisible && <div></div>}
      </div>

      <div id="containerFront">
        {isBackVisible && <div></div>}
      </div>
      <div id="containerLiveness">
        {isLivenessVisible && <div></div>}
      </div>

      <hr />

      <h3>Tokens</h3>
      <h4>{frontToken}</h4>
      <h4>{backToken}</h4>
      <h4>{livenessToken}</h4>

      <hr />

      {/* <h3>Información de personaje</h3>
      <code>{documentInformation}</code> */}
    </main>
  );
};

export default App;

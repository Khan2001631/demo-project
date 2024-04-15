export interface createPromptInterface {
  PROMPTNAME: string;
  DEFAULTACTION: string; // pending

  ACTORDEFINITION: string;
  ENVIRONMENTCONTEXT: string;
  CHALLENGEDESCRIPTION: string;
  DATAHANDLING: string;
  OBJECTIVE: string;
  AUDIENCE: string;
  TASK: string;
  // ITERATIVETASK: string;
  ITERATIVEPREPROMPTTASKS: string;
  ITERATIVEPOSTPROMPTFORMAT: string;
  WRITINGSTYLE: string;
  TIMELINEPRIORITY: string;
  OUTPUTFORMAT: string;
  PROMPTREFERENCES: string;
  PUBLICACCESSIBILITY?: number;
  FUNCTIONID: number;
}
export interface createPromptNameDescInterface {
  PROMPTNAME: string;
  PROMPTDESCRIPTION: string;
  AUTOSAVE: number | boolean;
  AUTHORVIEW: number | boolean,
  ALLOWTOCOPY: number | boolean,
  CUSTOMDATA: number | boolean,
  FUNCTIONCALL: number | boolean,
  SPONSOREDPROMPT: number | boolean,
  ITERATIVETASK: string,
  PUBLICACCESSIBILITY: number,
  PROMPTLEVEL: string,
  OPENSOURCE: number | boolean,
  promptImage: string,
  CUSTOMMODELID: number,
  PREMIUMPRICECC: number,
}
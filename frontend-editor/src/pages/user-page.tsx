import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/mini-ui/card";
import FullPageLoader from "../components/loader";
import { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";

type SessionDataType = {
  sessionName: string;
  private: boolean;
  description: string;
} | null;

const dummyData: SessionDataType[] = [
  {
    sessionName: "RET:10",
    private: false,
    description: "retail specs",
  },
  null,
  null,
];

export default function UserManagePage() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="bg-gray-200 p-4 h-screen ">
        <div className="flex items-center">
          <div className="w-full flex justify-center">
            <UserSesssonList />
          </div>
        </div>
        {loading && <FullPageLoader />}
      </div>
    </>
  );
}

function UserSesssonList() {
  return (
    <Card
      className="mx-auto w-full bg-white 
          bg-opacity-20  backdrop-blur-md p-6 rounded-lg shadow-lg mt-28"
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl md:text-2xl lg:text-2xl font-bold text-transparent bg-clip-text flex-grow bg-blue-500 mb-4">
          Sessions
        </CardTitle>
        {/* <CardDescription>Manage your sessions here</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {dummyData.map((sesData) => (
            <UserSessionCard sesData={sesData} />
          ))}
          <button className="relative text-center w-full flex items-center justify-between font-semibold p-4 rounded-lg border transition duration-150 ease-in-out shadow-md hover:shadow-lg group bg-yellow-50 text-yellow-900 border-yellow-200">
            <div className="flex flex-col space-y-1 items-center w-full">
              <h1 className="text-lg">Browse Public Sessions</h1>
              <p className="text-sm text-yellow-700">
                Explore sessions created by others
              </p>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function UserSessionCard({ sesData }: { sesData: SessionDataType }) {
  return (
    <button
      className={`relative w-full flex justify-between text-left font-semibold p-4 rounded-lg border transition duration-150 ease-in-out shadow-md hover:shadow-lg group transform hover:scale-105 ${
        sesData === null
          ? "bg-gray-50 text-gray-900 border-gray-200"
          : "bg-blue-50 text-blue-900 border-blue-200"
      }`}
    >
      <div className="flex flex-col space-y-1">
        {sesData === null ? (
          <div>
            <h1 className="text-lg">Create New Session</h1>
          </div>
        ) : (
          <>
            <h1 className="text-lg">{sesData.sessionName}</h1>
            <p className="text-sm text-blue-600">{sesData.description}</p>
          </>
        )}
      </div>

      {sesData && (
        <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out">
          <button
            className="text-sm text-gray-700 focus:outline-none"
            aria-label={sesData.private ? "Private session" : "Public session"}
          >
            {sesData.private ? "Private" : "Public"}
          </button>

          <button
            className="text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Delete session"
          >
            <RiDeleteBin2Line size={22} />
          </button>
        </div>
      )}
    </button>
  );
}

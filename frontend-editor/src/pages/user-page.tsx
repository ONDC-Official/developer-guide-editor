import { Card, CardContent, CardTitle } from "../components/ui/mini-ui/card";
import FullPageLoader from "../components/loader";
import { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";
const back_end = import.meta.env.VITE_BACKEND;

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
      <div className="bg-gray-200 p-4 h-screen">
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
function UserData() {
  return (
    <Card className="w-full bg-gray-200 p-6 rounded-lg shadow-lg relative">
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-700">Username: JohnDoe</p>
        <p className=" text-base text-gray-500">User ID: 123456</p>
      </div>
      <button className="text-xs py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out absolute bottom-4 right-4">
        Delete Account
      </button>
    </Card>
  );
}

function UserSesssonList() {
  return (
    <Card
      className="mx-auto w-full bg-white 
          bg-opacity-20  backdrop-blur-md p-6 rounded-lg shadow-lg mt-28"
    >
      <CardContent>
        <CardTitle className="text-2xl md:text-2xl lg:text-2xl font-bold text-transparent bg-clip-text flex-grow bg-blue-500 mb-4 mt-4">
          Sesssions
        </CardTitle>
        <div className="space-y-2">
          <SessionInput />
          <UserSessionCard sesData={null} />
          <button className="relative text-center w-full flex items-center justify-between font-semibold p-4 rounded-lg border transition duration-150 ease-in-out shadow-md hover:shadow-lg hover:scale-105 group bg-yellow-50 text-yellow-900 border-yellow-200">
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

function SessionInput() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  async function loadSession(id: string) {
    navigate(`/session/${id}`);
  }
  return (
    <div className="w-full space-y-4">
      {/* Input field to update session ID */}
      <input
        type="text"
        placeholder="Load session with ID..."
        value={id}
        onChange={(e) => setId(e.target.value)} // Update state as user types
        className="w-full text-blue-900 font-medium bg-gray-50 py-2 px-4 rounded-lg border border-gray-300 transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
      />

      {/* Button to trigger navigation */}
      <button
        onClick={async () => await loadSession(id)}
        className="relative w-5/12 flex items-center justify-center font-semibold py-2 px-4 rounded-lg border border-gray-300 transition duration-150 ease-in-out bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md"
      >
        <span className="text-sm">Load Session</span>
      </button>
    </div>
  );
}

function UserSessionCard({ sesData }: { sesData: SessionDataType }) {
  const navigate = useNavigate();
  async function createSession() {
    try {
      const id = uuid();
      await axios.post(
        `${back_end}/tree/CREATE_SESSION`,
        {},
        {
          headers: {
            "x-api-key": id,
          },
        }
      );
      navigate(`/session/${id}`);
    } catch (e) {
      console.error(e);
      toast.error("Error creating session");
    }
  }

  return (
    <button
      onClick={createSession}
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

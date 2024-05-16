import { DropDownSettings, scoreDescription } from "@/misc/RoundDataTypes"
import { Button } from "@/shadcnComponents/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcnComponents/ui/dropdown-menu"
import { Settings } from "lucide-react";

interface UsersDropDownProps {
    allUsers?: string[];
    selectedUsers?: string[];
    setSelectedUsers?: React.Dispatch<React.SetStateAction<string[]>>;
    dropDownSettings: DropDownSettings,
    setDropDownSettings: React.Dispatch<React.SetStateAction<DropDownSettings>>
    isSmallDevice: boolean,
}

const getBackgroundColor = (index: number) => {
    const colorIndex = 300 + (index * 100);
    return `bg-blue-${colorIndex}`;
};

export const ScoreDescriptions = ({ scoreDescriptions }: { scoreDescriptions: scoreDescription[] }) => {
    return (
        <div className="flex flex-col justify-center h-full mx-2 max-h-[30rem] md:p-2 p-1">
            {scoreDescriptions.map((score, index) => (
                <div key={index} className="flex items-center py-1">
                    <span className={`rounded-full min-w-8  ${getBackgroundColor(index)} text-white w-8 h-8 flex items-center justify-center mr-4`}>
                        {score.score}
                    </span>
                    <div>
                        <b>{score.title}</b>
                        <p>{score.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export const SettingsDropDown: React.FC<UsersDropDownProps> = ({ allUsers = [], selectedUsers = [], setSelectedUsers = () => { }, dropDownSettings, setDropDownSettings, isSmallDevice = false }) => {
    const { dataIsAcc, chartIsSticky, sideBySide } = dropDownSettings
    const selectUserChange = (user: string) => {
        setSelectedUsers(prevSelectedUsers => {
            return prevSelectedUsers.includes(user) ? prevSelectedUsers.filter(selectedUser => selectedUser !== user) : [...prevSelectedUsers, user]
        });
    };
    const selectAllUsersChange = () => {
        if (selectedUsers.length === allUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(allUsers);
        }
    };


    return (
        <DropdownMenu dir="ltr">
            <DropdownMenuTrigger asChild>
                <Button variant="outline" ><Settings /></Button>
                {/* <Button variant="secondary"><Settings /></Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" >
                {allUsers.length > 0 &&
                    <>
                        <DropdownMenuLabel>Användare</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={selectedUsers.length === allUsers.length}
                            onCheckedChange={selectAllUsersChange}
                        >
                            Samtliga
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        {allUsers.map(user =>
                            <DropdownMenuCheckboxItem
                                key={user}
                                checked={selectedUsers?.includes(user)}
                                onCheckedChange={() => selectUserChange(user)}
                            >
                                {user}
                            </DropdownMenuCheckboxItem>
                        )}
                        <DropdownMenuSeparator />
                    </>
                }
                <DropdownMenuLabel>Layout</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={dataIsAcc} onCheckedChange={() => setDropDownSettings({ ...dropDownSettings, dataIsAcc: !dataIsAcc })}>Genomsnitt per kategori</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={chartIsSticky} onCheckedChange={() => setDropDownSettings({ ...dropDownSettings, chartIsSticky: !chartIsSticky })}>Fäst diagram</DropdownMenuCheckboxItem>
                {!isSmallDevice && <DropdownMenuCheckboxItem checked={sideBySide} onCheckedChange={() => setDropDownSettings({ ...dropDownSettings, sideBySide: !sideBySide })}>Sida vid sida</DropdownMenuCheckboxItem>}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


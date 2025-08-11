import { fireEvent, render } from "@testing-library/react-native";
import { Receive } from "@/src/screens/Receive";

describe("Opening AdmissionObject modal conditions.", () => {

    /**
     * The proccess of create a new AdmissionObject should only occur if a user can provide a valid number,
     * the UI needs to be very informative so it obviouse this a number is required.
     */

    it("ParkButton can only be pressed when text is entered to mobile number input.", () => {
        const screen = render(<Receive />);
        const ParkButton = screen.getByTestId("ParkButton");
        fireEvent.press(ParkButton);
        let modal = screen.queryAllByTestId("InitAdmisObjModal");
        expect(modal).toHaveLength(0);
        const MobileNumberInput = screen.getByPlaceholderText("123-456-7890");
        fireEvent.changeText(MobileNumberInput, "7704046745");
        expect(ParkButton).toBeEnabled();
    });
});

describe("Adding and removing photos.", () => {
    it.todo("Most recent photo is first when adding while previewing the last photo.");
    it.todo("Removing from the middle maintains correct order.");
    it.todo("Image cache was deleted when all photos was removed.");
    it.todo("Image cache was deleted when modal was manually closed.");
});

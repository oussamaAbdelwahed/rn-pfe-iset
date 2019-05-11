import { Platform, StatusBar} from "react-native"
export const styles = {
    view_container: {
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight // android phones have issues with StatusBar overlap
            }
        }),
        flex: 1,
    },
    view_spinner_container: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: "center",
        alignItems: "center"
    }
}
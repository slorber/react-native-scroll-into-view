import { ScrollIntoViewAPI } from "./api";
import { useContext } from "react";
import Context from "./context"

function useScrollIntoViewContext(): ScrollIntoViewAPI {
  const value = useContext(Context);
  if (value === null) {
    throw new Error("react-native-scroll-into-view context is missing. " +
      "Don't forget to wrap a scrollview with  wrapScrollView(ScrollView) and use that ScrollView at the top of the component tree!")
  }
  return value;
}

export function useScrollIntoView() {
  const {scrollIntoView} = useScrollIntoViewContext()
  return scrollIntoView;
}

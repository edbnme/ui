// Alert Dialog - Public API
// Re-exports all components, types, and context from split files

export {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogContainer,
  type AlertDialogRootProps,
  type AlertDialogTriggerProps,
  type AlertDialogContainerProps,
} from "./alert-dialog";

export {
  AlertDialogContent,
  type AlertDialogContentProps,
} from "./alert-dialog-content";

export {
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogSubtitle,
  AlertDialogDescription,
  AlertDialogImage,
  type AlertDialogHeaderProps,
  type AlertDialogBodyProps,
  type AlertDialogFooterProps,
  type AlertDialogTitleProps,
  type AlertDialogSubtitleProps,
  type AlertDialogDescriptionProps,
  type AlertDialogImageProps,
} from "./alert-dialog-parts";

export {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
  type AlertDialogCloseProps,
} from "./alert-dialog-actions";

export {
  useAlertDialog,
  type AlertDialogContextValue,
} from "./alert-dialog-context";

// Primary alias
import { AlertDialogRoot } from "./alert-dialog";

/**
 * AlertDialog - Container component that manages dialog state.
 *
 * Use with named exports for sub-components.
 *
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button>Delete</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogTitle>Delete Item?</AlertDialogTitle>
 *     <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
 *     <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
 *     <AlertDialogCancel />
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */
const AlertDialog = AlertDialogRoot;
export { AlertDialog };

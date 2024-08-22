import { Dialog, DialogContent } from "./ui/dialog";

function CommentDialog({ open, setOpen }) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <img
          className="rounded-sm my-2 w-full aspect-square object-cover"
          src="https://res.cloudinary.com/djd4cvqxr/image/upload/v1724003654/jn4ze8z86cmtxuprrvln.jpg"
          alt="post_img"
        />
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;

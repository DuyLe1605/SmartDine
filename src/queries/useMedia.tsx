import mediaApiRequest from "@/apiRequests/media";
import { useMutation } from "@tanstack/react-query";

const uploadMediaMutation = () => {
    return useMutation({
        mutationFn: mediaApiRequest.upload,
    });
};

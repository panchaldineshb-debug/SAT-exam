

# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "opencv-python",
#     "yt-dlp",
# ]
# ///

import os
import re
import cv2
import time
import yt_dlp

# Log start time
time_start = time.time()

def video_to_frames_url_auto(url=None, folder='./cc/projects'):
    """Function to extract frames from input video url or file and save them as separate frames 
    in an output directory. Output directory will be named starting from video_1. If a new file is downloaded,
    a video_2 folder will be created and so on.
    Dependencies: 
        OpenCV (opencv-python)
        yt-dlp
    
    Args:
        url: Youtube video URL.
        folder: Directory to download and save each frames.
        
    Returns:
        None
    """
    # Ensure the parent folder exists
    os.makedirs(folder, exist_ok=True)

    # To make a directory for saving video automatically considering all the existing foldernames
    reg = re.compile(r'^video_')
    lst = sorted(os.listdir(folder))
    newlist = filter(reg.match, lst)
    numbers = [reg.sub('', x).strip() for x in newlist]
    results = [int(x) for x in numbers if x.isdigit()]
    
    if not results:
        newfile = 1
    else:
        newfile = sorted(results)[-1] + 1
        
    # Create a folder according to the files that are already present.   
    video_dir = os.path.join(folder, f"video_{newfile}")
    os.makedirs(video_dir, exist_ok=True)
    
    file_loc = os.path.join(video_dir, f"video_{newfile}.mp4")
    
    # Download from local video file
    if url:
        print(f"Downloading Youtube Video from {url}...")
        ydl_opts = {
            'outtmpl': file_loc,
            'format': 'mp4/best',
            'quiet': False
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        cap = cv2.VideoCapture(file_loc)
    else:
        raise ValueError("No video URL provided. Please pass a valid YouTube URL.")

    if not cap.isOpened():
        print(f"Error: Could not open video file {file_loc}")
        return

    video_length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) - 1
    print(f"Number of frames: {video_length}")
    count = 0
    print("Converting video to frames...\n")
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret or frame is None:
            break

        frame_path = os.path.join(video_dir, f"{count+1}.jpg")
        cv2.imwrite(frame_path, frame)
        count += 1
        if count > (video_length - 1):
            break
            
    time_end = time.time()
    cap.release()
    print(f"Done extracting frames.\n{count} frames extracted.")
    print(f"It took {int(time_end - time_start)} seconds for conversion.")

if __name__ == "__main__":
    import sys
    # Use URL passed as CLI argument, or ask user
    if len(sys.argv) > 1:
        target_url = sys.argv[1]
    else:
        target_url = "https://www.youtube.com/watch?v=ThxRE1L2Uzo" # Default test URL
        
    video_to_frames_url_auto(url=target_url)


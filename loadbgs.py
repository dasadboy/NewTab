import os

def get_backgrounds():
    bg_list = os.listdir("backgrounds")
    img_extentions = (".jpg", ".png", ".tiff", ".jpeg", ".tiff", ".gif")
    bg_list = [b for b in bg_list if b.endswith(img_extentions)]
    return bg_list

def write_backgroundsjs():
    bg_list = os.listdir("backgrounds")
    img_extentions = (".jpg", ".png", ".tiff", ".jpeg", ".tiff", ".gif")
    bg_list = [b for b in bg_list if b.endswith(img_extentions)]

    lines = [f"backgrounds = [\n"]
    
    for bg in bg_list:
        lines.append(f"\"{bg}\",\n") 

    lines.append("]\n")

    with open("bgs.js", "w") as bg_file:
        bg_file.writelines(lines)

    print(f"{len(bg_list)} backgrounds have been loaded.")


if __name__ == "__main__":
    write_backgroundsjs()

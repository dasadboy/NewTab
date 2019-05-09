import os

def get_backgrounds():
    bg_list = os.listdir("backgrounds")
    img_extentions = (".jpg", ".png", ".tiff", ".jpeg", ".tiff", ".gif")
    bg_list = [b for b in bg_list if b.endswith(img_extentions)]
    return bg_list

def write_backgroundsjs():
    backgrounds = get_backgrounds()

    text = f"backgrounds = {backgrounds}\n"

    with open("backgrounds.js", "r") as bg_file:
        lines = bg_file.readlines()

    lines[0] = text

    with open("backgrounds.js", "w") as bg_file:
        bg_file.writelines(lines)

    print(f"{len(backgrounds)} backgrounds have been loaded.")


if __name__ == "__main__":
    write_backgroundsjs()

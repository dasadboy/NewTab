#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
using namespace std;

int main()
{
  ofstream bgList;
  bgList.open ("bgs.txt");
  
  string path = "/backgrounds";
  
  if (bgList.is_open()) {
    bgList << "let backgrounds = [" << endl;
    for (const auto & entry: filesystem::directory_iterator("backgrounds")) {
      string p = entry.path;
      bgList << ", " + p;
      cout << ", " + p;
    }
    bgList << "]" << endl;
    cout << "]" << endl;
  }
  
  else cout << "Unable to open file." << endl;
  
  return 0;
}
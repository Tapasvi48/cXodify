
#include <iostream>
#include <vector>
#include <string>
using namespace std;

##USER_CODE_HERE##

int main() {
int n1;
std::cin >> n1;
std::vector<int>num1(n1,0);
for (auto& vec0 : num1) {
cin >> vec0;
}

int result = Average(num1);
std::cout << result << std::endl;
return 0;
}
  
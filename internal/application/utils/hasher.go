package utils

import "golang.org/x/crypto/bcrypt"

func Hash(plainText string) string {
	hashBytes, _ := bcrypt.GenerateFromPassword([]byte(plainText), bcrypt.DefaultCost)
	return string(hashBytes)
}

func CompareHash(plainText string, hash string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(plainText)); err != nil {
		return false
	}
	return true
}

//func GenerateUniqID()

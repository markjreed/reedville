(use-package "CC")
(defpackage :cindu (:use "CC" "CL"))
(in-package :cindu)
(export '(lero-from-fixed fixed-from-lero lero-from-moment moment-from-lero
          cindu-quarter-from-lero cindu-year-from-lero cindu-from-fixed
          fixed-from-cindu cindu-from-lero lero-from-cindu cindu-from-moment
          cindu-time-from-moment))

;; Purely arithemtic implementation of the Cindu calendar.  
;; 
;; Gregorian '(1934 5 23) = RD 706156 = Cindu '(702 1 1) = Lero (Cindu day) 325376
;;
;; Since 1 lero  = 25.3 Earth hours, that means
;; RD 0 = lero 325376 - 706156 * 24 / 25.3 = lero -7923392/23
;; and
;; lero 0 = RD 706156 - 325376 * 25.3 / 24 = RD 363155 7/15

;; RD number of CD 0
(defparameter lero0  (+ 363155 7/15))

(defun lero-from-moment (date) (* (- date lero0) 240/253))

(defun moment-from-lero (date) (+ (* date 253/240) lero0))

(defun lero-from-fixed (date) (floor (lero-from-moment (floor (+ 0.5 date)))))

(defun fixed-from-lero (date) (floor (moment-from-lero (floor (+ date 0.5)))))

;; Now convert between fixed day counts and calendar dates within the Cindu 
;; units.  
(defun cindu-date (year month week day) (list year month week day))

(defun cindu-from-fixed (date) (cindu-from-lero (lero-from-fixed date)))

(defun cindu-from-moment (date) (cindu-from-lero (lero-from-moment date)))

(defun fixed-from-cindu (c-date) (fixed-from-lero (lero-from-cindu c-date)))

(defun cindu-quarter-from-lero (lero) (let ((n (1- lero))) (ceiling (+ (* 76 n) 33) 8819) ))

(defun cindu-year-from-lero (lero) (cindu-year-from-quarter (cindu-quarter-from-lero lero)))

(defun cindu-leroc-before-quarter (quarter) (+ (floor (+ (* 3 quarter) 40) 76) (* 116 (1- quarter))))

(defun cindu-leroc-before-year (year) (+ (floor (+ (* 12 year) 31) 76) (* 464 (1- year))))

(defun cindu-year-from-quarter (quarter) (1+ (floor (1- quarter) 4)))

(defun cindu-leap-quarter? (quarter) (< (mod (* (+ quarter 65) 3) 76) 3))

(defun cindu-leap-year? (year) (< (mod (* (+ year 16) 3) 19) 3))

(defun cindu-from-lero (lero) 
     (let* ((quarter (cindu-quarter-from-lero lero))
            (prior-leroc (cindu-leroc-before-quarter quarter))
            (leroc-into-quarter (- lero prior-leroc))
            (is-leap? (cindu-leap-quarter? quarter))
            (season (cc::adjusted-mod quarter 4))
            (year (cindu-year-from-quarter quarter))
            (leroc-in-first-month (+ 29 (if is-leap? 1 0)))
            (leroc-since-first-month (- leroc-into-quarter leroc-in-first-month))
            (month-of-season (if (>= leroc-since-first-month 1) (+ (floor (1- leroc-since-first-month) 29) 2) 1))
            (month (+ (* (1- season) 4) month-of-season))
            (mday (if (>= leroc-since-first-month 1) (1+ (mod (1- leroc-since-first-month) 29)) leroc-into-quarter))
            (prefix-leap-day? (and is-leap? (= month-of-season 1) (= season 1)))
            (midmonth-leap-day? (and is-leap? (= month-of-season 1) (/= season 1)))
            (adjusted-mday (cond ((and prefix-leap-day? (> mday 15)) (- mday 2))
                                 (prefix-leap-day? (1- mday))
                                 ((and midmonth-leap-day? (> mday 16)) (- mday 2))
                                 ((> mday 15) (1- mday))
                                 (t mday)))
            (week (1+ (floor (1- adjusted-mday) 7)))
            (wday (1+ (mod (1- adjusted-mday) 7)))
            (fday (floor mday))
            (frac (mod wday 1)))
            (cond 
                ((and prefix-leap-day? (= fday 1)) (cindu-date year month 1 frac))
                ((and prefix-leap-day? (= fday 16)) (cindu-date year month 2 (+ 8 frac)))
                ((and (not prefix-leap-day?) (= fday 15)) (cindu-date year month 2 (+ 8 frac)))
                ((and midmonth-leap-day? (= fday 16)) (cindu-date year month 3 frac))
                (t (cindu-date year month week wday)))))

(defun lero-from-cindu (c-date)
        (destructuring-bind (year month week day) c-date
          (let* ((quarter (+ (* 4 (1- year)) 1 (floor (1- month) 4)))
                 (season (cc::adjusted-mod quarter 4))
                 (months-elapsed-in-quarter (mod (1- month) 4))
                 (is-leap? (cindu-leap-quarter? quarter))
                 (past-cinjurak? (> week 2))
                 (past-leap-day? 
                   (and is-leap? (or (> months-elapsed-in-quarter 0) 
                                     (= season 1) 
                                     (> week 2))))
                 (prior (cindu-leroc-before-quarter quarter)))
            (+ prior 
               (* 29 months-elapsed-in-quarter)
               (if past-leap-day? 1 0) 
               (* 7 (1- week)) 
               (if past-cinjurak? 1 0) 
               day))))

(defun cindu-time-from-moment (c-date) 
     (let* ((frac (mod c-date 1.0L0))
            (hours (* frac 20.0L0))
            (hour (floor hours))
            (minutes (floor (* (- hours hour) 50))))
        (format nil "~2,'0D~2,'0D" (1+ hour) minutes)))
